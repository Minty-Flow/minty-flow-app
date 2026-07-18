import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgCodeAi = (props: SvgProps) => (
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
    <Path d="M7 8l-4 4l4 4" />
    <Path d="M17 8l3.111 3.111" />
    <Path d="M14 4l-2.175 8.7" />
    <Path d="M14 21v-4a2 2 0 1 1 4 0v4" />
    <Path d="M14 19h4" />
    <Path d="M21 15v6" />
  </Svg>
);
export default SvgCodeAi;
