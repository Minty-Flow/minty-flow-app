import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowAutofitUp = (props: SvgProps) => (
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
    <Path d="M12 4h-6a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h8" />
    <Path d="M18 20v-17" />
    <Path d="M15 6l3 -3l3 3" />
  </Svg>
);
export default SvgArrowAutofitUp;
