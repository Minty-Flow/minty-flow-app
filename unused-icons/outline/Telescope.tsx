import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTelescope = (props: SvgProps) => (
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
    <Path d="M6 21l6 -5l6 5" />
    <Path d="M12 13v8" />
    <Path d="M3.294 13.678l.166 .281c.52 .88 1.624 1.265 2.605 .91l14.242 -5.165a1.023 1.023 0 0 0 .565 -1.456l-2.62 -4.705a1.087 1.087 0 0 0 -1.447 -.42l-.056 .032l-12.694 7.618c-1.02 .613 -1.357 1.897 -.76 2.905l-.001 0" />
    <Path d="M14 5l3 5.5" />
  </Svg>
);
export default SvgTelescope;
