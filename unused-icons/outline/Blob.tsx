import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBlob = (props: SvgProps) => (
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
    <Path d="M5.897 20.188c1.67 .752 3.896 .812 6.103 .812s4.434 -.059 6.104 -.812c.868 -.392 1.614 -.982 2.133 -1.856c.514 -.865 .763 -1.94 .763 -3.234c0 -2.577 -.983 -5.315 -2.557 -7.416c-1.57 -2.094 -3.833 -3.682 -6.443 -3.682s-4.873 1.588 -6.443 3.682c-1.574 2.101 -2.557 4.84 -2.557 7.416c0 1.295 .249 2.369 .763 3.234c.519 .874 1.265 1.464 2.134 1.856" />
  </Svg>
);
export default SvgBlob;
