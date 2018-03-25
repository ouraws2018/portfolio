import boto3
from botocore.client import Config
import zipfile
from io import StringIO
import io
import mimetypes

def lambda_handler(event, context):
    sns = boto3.resource('sns')
    topic = sns.Topic('arn:aws:sns:us-east-1:237183624644:Portfolio')

    location = {
        "bucketName": 'codebuild.craigkeenan.info',
        "objectKey": 'Portfolio/codebuild.portfolio.zip'
    }

    try:
        job = event.get("CodePipeline.job")

        if job:
            for artifact in job["data"]["inputArtifacts"]:
                if artifact["name"] == "MyAppBuild":
                    location = artifact["location"]["s3Location"]

        print ("Building portfolio from " + str(location))

        s3 = boto3.resource('s3')

        s3_bucket_codebuild = s3.Bucket(location["bucketName"])
        s3_bucket_portfolio = s3.Bucket('portfolio.craigkeenan.info')

        portfolio_zip = io.BytesIO()
        s3_bucket_codebuild.download_fileobj(location["objectKey"], portfolio_zip)

        with zipfile.ZipFile(portfolio_zip) as myzip:
            for i in myzip.namelist():
                obj = myzip.open(i)
                s3_bucket_portfolio.upload_fileobj(obj,i,
                ExtraArgs={'ContentType': mimetypes.guess_type(i)[0]})
                s3_bucket_portfolio.Object(i).Acl().put(ACL='public-read')

        print ("Completed Successfully")
        topic.publish(Subject="Portfolio Deployed", Message="Portfolio Extract Upload Successful.")
        if job:
            codepipeline = boto3.client('codepipeline')
            codepipeline.put_job_success_result(jobId=job["id"])
    except:
        topic.publish(Subject="Portfolio Deploy Failed", Message="Portfolio Extract Upload Unsuccessful.")
    return 'CodeBuild Extract Zip and Upload Files Completed Successfully'
