import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgItalicOff = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M11 5h6" />
    <Path d="M7 19h6" />
    <Path d="M11.8 12.9l-1.8 6.1" />
    <Path d="M2.8 3l18 18" />
    <Path d="M14 5l-1.2 4.1" />
  </Svg>
);
export default SvgItalicOff;
