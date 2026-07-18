import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgVignette = (props: SvgProps) => (
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
    <Path d="M21 12a9 9 0 1 1 -18 0a9 9 0 0 1 18 0" />
    <Path d="M7.02 12h-.01" />
    <Path d="M12.02 7h-.01" />
    <Path d="M17.02 12h-.01" />
    <Path d="M12.02 17h-.01" />
    <Path d="M8.483 8.468l-.007 -.007" />
    <Path d="M15.554 8.468l-.007 -.007" />
    <Path d="M15.554 15.539l-.007 -.007" />
    <Path d="M8.483 15.539l-.007 -.007" />
  </Svg>
);
export default SvgVignette;
