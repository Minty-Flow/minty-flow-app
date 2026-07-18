import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgYoga = (props: SvgProps) => (
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
    <Path d="M4 20h4l1.5 -3" />
    <Path d="M17 20l-1 -5h-5l1 -7" />
    <Path d="M4 10l4 -1l4 -1l4 1.5l4 1.5" />
    <Path d="M10.007 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  </Svg>
);
export default SvgYoga;
