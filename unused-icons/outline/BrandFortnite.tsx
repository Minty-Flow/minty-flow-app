import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandFortnite = (props: SvgProps) => (
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
    <Path d="M8 3h7.5l-.5 4h-3v3h3v3.5h-3v6.5l-4 1l0 -18" />
  </Svg>
);
export default SvgBrandFortnite;
