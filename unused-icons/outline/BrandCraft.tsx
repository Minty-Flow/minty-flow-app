import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandCraft = (props: SvgProps) => (
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
    <Path d="M20 4h-8a8 8 0 1 0 0 16h8a8 8 0 0 0 -8 -8a8 8 0 0 0 8 -8" />
    <Path d="M4 12h8" />
    <Path d="M12 4v16" />
  </Svg>
);
export default SvgBrandCraft;
