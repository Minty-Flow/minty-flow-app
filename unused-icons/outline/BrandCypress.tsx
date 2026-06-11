import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandCypress = (props: SvgProps) => (
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
    <Path d="M19.48 17.007a9 9 0 1 0 -7.48 3.993c.896 0 1.691 -.573 1.974 -1.423l3.526 -10.577" />
    <Path d="M13.5 9l2 6" />
    <Path d="M10.764 9.411a3 3 0 1 0 -.023 5.19" />
  </Svg>
);
export default SvgBrandCypress;
