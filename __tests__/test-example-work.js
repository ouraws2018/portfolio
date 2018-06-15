import React from 'react';
import { shallow } from 'enzyme';
import ExampleWork, {ExampleWorkBubble} from '../js/example-work';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

const myWork = [
  {
    'title': "Work Example",
    'image': {
      'desc': "example screenshot of a project involving infratrcuture-as-code",
      'src': "images/example1.png",
      'comment': ""
    }
  },
  {
    'title': "Portfolio Boilerplate",
    'image': {
      'desc': "Serverless Portfolio",
      'src': "images/example2.png",
      'comment': ""
    }
  }
]

describe("ExampleWork Component", () => {
  let component = shallow(<ExampleWork work={myWork}/>);

  it("Test should be a 'section' element", () => {
    expect(component.type()).toEqual('section');
  });

  it("Test should contain a child for each work example", () => {
    expect(component.find("ExampleWorkBubble").length).toEqual(myWork.length);
  });
});

describe("ExampleWorkBubble Component", () => {
  let component = shallow(<ExampleWorkBubble example={myWork[1]}/>);

  let images = component.find("img");

  it("Test should contain a single 'img' element", () => {
    expect(images.length).toEqual(1);
  });

  it("Test should have the image srs set correctly", () => {
    expect(images.prop('src')).toEqual(myWork[1].image.src);
  });
});
