import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTemperatureSnow = (props: SvgProps) => (
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
    <Path d="M4 13.5a4 4 0 1 0 4 0v-8.5a2 2 0 1 0 -4 0v8.5" />
    <Path d="M4 9h4" />
    <Path d="M14.75 4l1 2h2.25" />
    <Path d="M17 4l-3 5l2 3" />
    <Path d="M20.25 10l-1.25 2l1.25 2" />
    <Path d="M22 12h-6l-2 3" />
    <Path d="M18 18h-2.25l-1 2" />
    <Path d="M17 20l-3 -5h-1" />
    <Path d="M12 9l2.088 .008" />
  </Svg>
);
export default SvgTemperatureSnow;
