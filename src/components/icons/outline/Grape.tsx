import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgGrape = (props: SvgProps) => (
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
    <Path d="M13 3a14.5 14.5 0 0 0 -1 6" />
    <Path d="M12 8.9s-2.77 .52 -4.1 -.8s-.8 -4 -.8 -4s2.57 -.53 3.88 .8s1.02 4 1.02 4" />
    <Path d="M14 19a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M14 17a2 2 0 1 1 0 -4a2 2 0 0 1 0 4" />
    <Path d="M10 17a2 2 0 1 1 0 -4a2 2 0 0 1 0 4" />
    <Path d="M12 13a2 2 0 1 1 0 -4a2 2 0 0 1 0 4" />
    <Path d="M16 13a2 2 0 1 1 0 -4a2 2 0 0 1 0 4" />
    <Path d="M8 13a2 2 0 1 1 0 -4a2 2 0 0 1 0 4" />
  </Svg>
);
export default SvgGrape;
