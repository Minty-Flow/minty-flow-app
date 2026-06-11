import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLetterA = (props: SvgProps) => (
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
    <Path d="M7 20v-12a4 4 0 0 1 4 -4h2a4 4 0 0 1 4 4v12" />
    <Path d="M7 13l10 0" />
  </Svg>
);
export default SvgLetterA;
