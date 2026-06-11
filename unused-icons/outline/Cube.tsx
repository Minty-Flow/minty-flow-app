import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCube = (props: SvgProps) => (
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
    <Path d="M21 16.008v-8.018a1.98 1.98 0 0 0 -1 -1.717l-7 -4.008a2.016 2.016 0 0 0 -2 0l-7 4.008c-.619 .355 -1 1.01 -1 1.718v8.018c0 .709 .381 1.363 1 1.717l7 4.008a2.016 2.016 0 0 0 2 0l7 -4.008c.619 -.355 1 -1.01 1 -1.718" />
    <Path d="M12 22v-10" />
    <Path d="M12 12l8.73 -5.04" />
    <Path d="M3.27 6.96l8.73 5.04" />
  </Svg>
);
export default SvgCube;
