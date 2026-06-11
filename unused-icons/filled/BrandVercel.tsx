import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandVercel = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M11.143 3.486a1 1 0 0 1 1.714 0l9 15a1 1 0 0 1 -.857 1.514h-18a1 1 0 0 1 -.857 -1.514z" />
  </Svg>
);
export default SvgBrandVercel;
