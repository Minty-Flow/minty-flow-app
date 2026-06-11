import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgEyeTable = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M20 2a1 1 0 0 1 0 2v16a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-16a1 1 0 1 1 0 -2zm-12 15l-.128 .007a1 1 0 0 0 .118 1.993l.128 -.007a1 1 0 0 0 -.118 -1.993m4 0l-.128 .007a1 1 0 0 0 .118 1.993l.128 -.007a1 1 0 0 0 -.118 -1.993m4 0l-.128 .007a1 1 0 0 0 .118 1.993l.128 -.007a1 1 0 0 0 -.118 -1.993m-6 -3h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 0 -2m5 0h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 0 -2m-1 -8h-4a1 1 0 1 0 0 2h1v3a1 1 0 0 0 2 0v-3h1a1 1 0 0 0 0 -2" />
  </Svg>
);
export default SvgEyeTable;
