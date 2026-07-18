import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgPillow = (props: SvgProps) => (
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
    <Path d="M6 9a9.34 9.34 0 0 1 0 6" />
    <Path d="M21.699 16.607c.481 .934 .28 2.088 -.486 2.79c-.767 .703 -1.9 .77 -2.74 .165a48 48 0 0 1 -12.946 0a2.16 2.16 0 0 1 -2.74 -.165a2.345 2.345 0 0 1 -.486 -2.79a41.7 41.7 0 0 1 0 -9.163a2.346 2.346 0 0 1 .433 -2.856a2.16 2.16 0 0 1 2.793 -.145a48 48 0 0 1 12.946 0a2.16 2.16 0 0 1 2.793 .145c.78 .726 .961 1.918 .433 2.856a41.7 41.7 0 0 1 0 9.163" />
  </Svg>
);
export default SvgPillow;
