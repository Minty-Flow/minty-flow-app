import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgArrowForkTriple = (props: SvgProps) => (
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
    <Path d="M12 3v18" />
    <Path d="M16 7l-4 -4l-4 4" />
    <Path d="M16 11h5v5" />
    <Path d="M8 11h-5v5" />
    <Path d="M3 11l8.293 8.293c.453 .453 .707 1.067 .707 1.707" />
    <Path d="M21 11l-8.293 8.293a2.4 2.4 0 0 0 -.707 1.707" />
  </Svg>
);
export default SvgArrowForkTriple;
