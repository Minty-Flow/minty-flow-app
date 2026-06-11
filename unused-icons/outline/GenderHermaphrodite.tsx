import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGenderHermaphrodite = (props: SvgProps) => (
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
    <Path d="M12 14v7" />
    <Path d="M9 18h6" />
    <Path d="M12 6a4 4 0 1 1 0 8a4 4 0 0 1 0 -8" />
    <Path d="M15 3a3 3 0 1 1 -6 0" />
  </Svg>
);
export default SvgGenderHermaphrodite;
