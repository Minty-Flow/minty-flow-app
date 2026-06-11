import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGenderGenderless = (props: SvgProps) => (
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
    <Path d="M12 10a5 5 0 1 1 0 10a5 5 0 0 1 0 -10" />
    <Path d="M12 10v-7" />
    <Path d="M7 15h10" />
  </Svg>
);
export default SvgGenderGenderless;
