import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGenderFemme = (props: SvgProps) => (
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
    <Path d="M7 9a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
    <Path d="M12 14v7" />
    <Path d="M7 18h10" />
  </Svg>
);
export default SvgGenderFemme;
