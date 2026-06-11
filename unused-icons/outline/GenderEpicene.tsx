import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGenderEpicene = (props: SvgProps) => (
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
    <Path d="M15.536 15.536a5 5 0 1 0 -7.072 -7.072a5 5 0 0 0 7.072 7.072" />
    <Path d="M15.536 15.535l5.464 -5.535" />
    <Path d="M3 14l5.464 -5.535" />
    <Path d="M12 12h.01" />
  </Svg>
);
export default SvgGenderEpicene;
