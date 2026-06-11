import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandCupra = (props: SvgProps) => (
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
    <Path d="M4.5 10l-2.5 -4l15.298 6.909a.2 .2 0 0 1 .09 .283l-3.388 5.808" />
    <Path d="M10 19l-3.388 -5.808a.2 .2 0 0 1 .09 -.283l15.298 -6.909l-2.5 4" />
  </Svg>
);
export default SvgBrandCupra;
