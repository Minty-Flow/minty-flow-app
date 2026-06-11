import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandSuperhuman = (props: SvgProps) => (
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
    <Path d="M16 12l4 3l-8 7l-8 -7l4 -3" />
    <Path d="M12 3l-8 6l8 6l8 -6l-8 -6" />
    <Path d="M12 15h8" />
  </Svg>
);
export default SvgBrandSuperhuman;
