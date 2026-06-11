import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgPlaylist = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M21 3a1 1 0 0 1 0 2h-3v12a4 4 0 1 1 -2.001 -3.465l.001 -9.535a1 1 0 0 1 1 -1z" />
    <Path d="M14 5a1 1 0 0 1 -1 1h-10a1 1 0 1 1 0 -2h10a1 1 0 0 1 1 1" />
    <Path d="M14 9a1 1 0 0 1 -1 1h-10a1 1 0 1 1 0 -2h10a1 1 0 0 1 1 1" />
    <Path d="M10 13a1 1 0 0 1 -1 1h-6a1 1 0 0 1 0 -2h6a1 1 0 0 1 1 1" />
  </Svg>
)
export default SvgPlaylist
