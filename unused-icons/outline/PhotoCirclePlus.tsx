import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPhotoCirclePlus = (props: SvgProps) => (
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
    <Path d="M15 8h.01" />
    <Path d="M20.964 12.806a9 9 0 0 0 -8.964 -9.806a9 9 0 0 0 -9 9a9 9 0 0 0 9.397 8.991" />
    <Path d="M4 15l4 -4c.928 -.893 2.072 -.893 3 0l4 4" />
    <Path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0" />
    <Path d="M16 19.33h6" />
    <Path d="M19 16.33v6" />
  </Svg>
);
export default SvgPhotoCirclePlus;
