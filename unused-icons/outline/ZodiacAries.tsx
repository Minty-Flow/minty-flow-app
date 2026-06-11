import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgZodiacAries = (props: SvgProps) => (
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
    <Path d="M12 5a5 5 0 1 0 -4 8" />
    <Path d="M16 13a5 5 0 1 0 -4 -8" />
    <Path d="M12 21l0 -16" />
  </Svg>
);
export default SvgZodiacAries;
