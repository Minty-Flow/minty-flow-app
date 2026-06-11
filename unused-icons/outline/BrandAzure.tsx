import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandAzure = (props: SvgProps) => (
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
    <Path d="M6 7.5l-4 9.5h4l6 -15l-6 5.5" />
    <Path d="M22 20l-7 -15l-3 7l4 5l-8 3l14 0" />
  </Svg>
);
export default SvgBrandAzure;
