import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCloudNetwork = (props: SvgProps) => (
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
    <Path d="M3 20h7" />
    <Path d="M14 20h7" />
    <Path d="M10 20a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <Path d="M12 16v2" />
    <Path d="M8 16.004h-1.343c-2.572 -.004 -4.657 -2.011 -4.657 -4.487c0 -2.475 2.085 -4.482 4.657 -4.482c.393 -1.762 1.794 -3.2 3.675 -3.773c1.88 -.572 3.956 -.193 5.444 1c1.488 1.19 2.162 3.007 1.77 4.769h.99c1.913 0 3.464 1.56 3.464 3.486c0 1.927 -1.551 3.487 -3.465 3.487h-2.535" />
  </Svg>
);
export default SvgCloudNetwork;
