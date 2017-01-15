/**
 * Created by eugenia on 14.01.17.
 */
import {
  indigo500, indigo700,
  pinkA200,
  deepPurple50, deepPurple100, deepPurple300, deepPurple500,
  white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

export default {
  spacing: spacing,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: indigo500,
    primary2Color: indigo700,
    primary3Color: deepPurple300,
    accent1Color: pinkA200,
    accent2Color: deepPurple50,
    accent3Color: deepPurple500,
    textColor: darkBlack,
    secondaryTextColor: fade(darkBlack, 0.54),
    alternateTextColor: white,
    canvasColor: white,
    borderColor: deepPurple100,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: indigo500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack,
  },
};