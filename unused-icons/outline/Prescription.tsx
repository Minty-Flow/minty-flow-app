import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPrescription = (props: SvgProps) => (
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
    <Path d="M6 19v-16h4.5a4.5 4.5 0 1 1 0 9h-4.5" />
    <Path d="M19 21l-9 -9" />
    <Path d="M13 21l6 -6" />
  </Svg>
);
export default SvgPrescription;
