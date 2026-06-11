import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPolaroid = (props: SvgProps) => (
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
    <Path d="M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12" />
    <Path d="M4 16l16 0" />
    <Path d="M4 12l3 -3c.928 -.893 2.072 -.893 3 0l4 4" />
    <Path d="M13 12l2 -2c.928 -.893 2.072 -.893 3 0l2 2" />
    <Path d="M14 7l.01 0" />
  </Svg>
);
export default SvgPolaroid;
