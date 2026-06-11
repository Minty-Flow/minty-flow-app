import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCropLandscape = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M18 5a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3z" />
  </Svg>
);
export default SvgCropLandscape;
