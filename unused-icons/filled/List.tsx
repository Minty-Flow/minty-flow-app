import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgList = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M21 6a1 1 0 0 1 -1 1h-10a1 1 0 1 1 0 -2h10a1 1 0 0 1 1 1" />
    <Path d="M21 12a1 1 0 0 1 -1 1h-10a1 1 0 0 1 0 -2h10a1 1 0 0 1 1 1" />
    <Path d="M21 18a1 1 0 0 1 -1 1h-10a1 1 0 0 1 0 -2h10a1 1 0 0 1 1 1" />
    <Path d="M7 5.995v.02c0 1.099 -.895 1.99 -2 1.99s-2 -.891 -2 -1.99v-.02c0 -1.099 .895 -1.99 2 -1.99s2 .891 2 1.99" />
    <Path d="M7 11.995v.02c0 1.099 -.895 1.99 -2 1.99s-2 -.891 -2 -1.99v-.02c0 -1.099 .895 -1.99 2 -1.99s2 .891 2 1.99" />
    <Path d="M7 17.995v.02c0 1.099 -.895 1.99 -2 1.99s-2 -.891 -2 -1.99v-.02c0 -1.099 .895 -1.99 2 -1.99s2 .891 2 1.99" />
  </Svg>
);
export default SvgList;
