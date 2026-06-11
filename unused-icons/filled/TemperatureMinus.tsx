import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTemperatureMinus = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M10 2a3 3 0 0 1 3 3v7.965l.075 .056a5 5 0 0 1 1.81 5.01l-.055 .227a5 5 0 1 1 -7.905 -5.237l.075 -.056v-7.965a3 3 0 0 1 2.824 -2.995zm12 6a1 1 0 0 1 0 2h-6a1 1 0 0 1 0 -2zm-12 -4a1 1 0 0 0 -1 1v4h2v-4a1 1 0 0 0 -1 -1" />
  </Svg>
);
export default SvgTemperatureMinus;
