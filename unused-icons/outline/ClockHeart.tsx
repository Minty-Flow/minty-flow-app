import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgClockHeart = (props: SvgProps) => (
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
    <Path d="M20.956 11.107a9 9 0 1 0 -9.579 9.871" />
    <Path d="M18 22l3.35 -3.284a2.143 2.143 0 0 0 .005 -3.071a2.242 2.242 0 0 0 -3.129 -.006l-.224 .22l-.223 -.22a2.242 2.242 0 0 0 -3.128 -.006a2.143 2.143 0 0 0 -.006 3.071l3.355 3.296" />
    <Path d="M12 7v5l.5 .5" />
  </Svg>
);
export default SvgClockHeart;
