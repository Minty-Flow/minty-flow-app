import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPhotoDown = (props: SvgProps) => (
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
    <Path d="M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6.5" />
    <Path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l4 4" />
    <Path d="M14 14l1 -1c.653 -.629 1.413 -.815 2.13 -.559" />
    <Path d="M19 16v6" />
    <Path d="M22 19l-3 3l-3 -3" />
  </Svg>
);
export default SvgPhotoDown;
