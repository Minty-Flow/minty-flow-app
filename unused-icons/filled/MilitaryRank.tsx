import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMilitaryRank = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M12.555 2.168l6 4a1 1 0 0 1 .445 .832v12a3 3 0 0 1 -3 3h-8a3 3 0 0 1 -3 -3v-12a1 1 0 0 1 .445 -.832l6 -4a1 1 0 0 1 1.11 0m-.108 12.938a1 1 0 0 0 -.894 0l-2 1a1 1 0 0 0 -.447 1.341l.058 .102a1 1 0 0 0 1.283 .345l1.553 -.776l1.553 .776a1 1 0 0 0 .894 -1.788zm0 -4a1 1 0 0 0 -.894 0l-2 1a1 1 0 0 0 -.447 1.341l.058 .102a1 1 0 0 0 1.283 .345l1.553 -.776l1.553 .776a1 1 0 0 0 .894 -1.788zm0 -4a1 1 0 0 0 -.894 0l-2 1a1 1 0 0 0 -.447 1.341l.058 .102a1 1 0 0 0 1.283 .345l1.553 -.776l1.553 .776a1 1 0 0 0 .894 -1.788z" />
  </Svg>
);
export default SvgMilitaryRank;
