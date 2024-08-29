const satisfactionRanges = {
  sunny: {
    lower: {
      min: 3,
      max: 100,
      value: 90,
      selectValue: 90,
      isDisabled: false,
    },
    higher: {
      min: 100,
      max: 100,
      value: 100,
      selectValue: 100,
      isDisabled: true,
    },
  },
  partlySunny: {
    lower: {
      min: 2,
      max: 89,
      value: 80,
      selectValue: 80,
      isDisabled: false,
    },
    higher: {
      min: 3,
      max: 90,
      value: 90,
      selectValue: 90,
      isDisabled: false,
    },
  },
  cloudy: {
    lower: {
      min: 1,
      max: 79,
      value: 70,
      selectValue: 70,
      isDisabled: false,
    },
    higher: {
      min: 2,
      max: 80,
      value: 80,
      selectValue: 80,
      isDisabled: false,
    },
  },
  rainy: {
    lower: {
      min: 0,
      max: 0,
      value: 0,
      selectValue: 0,
      isDisabled: true,
    },
    higher: {
      min: 1,
      max: 70,
      value: 70,
      selectValue: 70,
      isDisabled: false,
    },
  },
};

export { satisfactionRanges };
