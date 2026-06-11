import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandFigma = (props: SvgProps) => (
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
    <Path d="M12 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M6 6a3 3 0 0 1 3 -3h6a3 3 0 0 1 3 3a3 3 0 0 1 -3 3h-6a3 3 0 0 1 -3 -3" />
    <Path d="M9 9a3 3 0 0 0 0 6h3m-3 0a3 3 0 1 0 3 3v-15" />
  </Svg>
);
export default SvgBrandFigma;
