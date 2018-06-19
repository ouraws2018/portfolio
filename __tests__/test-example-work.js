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

  it("Test should be a 'span' element", () => {
    expect(component.type()).toEqual('span');
  });

  it("Test should contain a child for each work example", () => {
    expect(component.find("ExampleWorkBubble").length).toEqual(myWork.length);
  });

  it("Test should allow the modal to open and close", () => {
    component.instance().openModal();
    expect(component.instance().state.modalOpen).toBe(true);
    component.instance().closeModal();
    expect(component.instance().state.modalOpen).toBe(false);
  });

});

describe("ExampleWorkBubble Component", () => {
  let mockOpenModalFn = jest.fn();

  let component = shallow(<ExampleWorkBubble example={myWork[1]}
    openModal={mockOpenModalFn}/>);

  let images = component.find("img");

  it("Test should contain a single 'img' element", () => {
    expect(images.length).toEqual(1);
  });

  it("Test should have the image srs set correctly", () => {
    expect(images.prop('src')).toEqual(myWork[1].image.src);
  });

  it("Test should call the openModal handler when clicked", () => {
    component.find(".section__exampleWrapper").simulate('click');
    expect(mockOpenModalFn).toHaveBeenCalled();
  });
});
