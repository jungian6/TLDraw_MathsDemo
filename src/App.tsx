import {
  Tldraw,
  DefaultToolbar,
  DefaultToolbarContent,
  TldrawUiMenuItem,
  useIsToolSelected,
  useTools,
  DefaultKeyboardShortcutsDialog,
  DefaultKeyboardShortcutsDialogContent,
} from 'tldraw'
import type { TLComponents, TLUiOverrides } from 'tldraw'
import 'tldraw/tldraw.css'
import { KatexTool } from './KatexTool'
import { KatexShapeUtil } from './KatexShapeUtil'

const customShapeUtils = [KatexShapeUtil]
const customTools = [KatexTool]

// UI overrides to add our katex tool
const uiOverrides: TLUiOverrides = {
  tools(editor, tools) {
    // Add the katex tool to the ui's context
    tools.katex = {
      id: 'katex',
      icon: 'plus',
      label: 'Math',
      kbd: 'm',
      onSelect: () => {
        editor.setCurrentTool('katex')
      },
    }
    return tools
  },
}

// Components to customize the toolbar and keyboard shortcuts
const components: TLComponents = {
  Toolbar: (props) => {
    const tools = useTools()
    const isKatexSelected = useIsToolSelected(tools['katex'])
    return (
      <DefaultToolbar {...props}>
        <TldrawUiMenuItem {...tools['katex']} isSelected={isKatexSelected} />
        <DefaultToolbarContent />
      </DefaultToolbar>
    )
  },
  KeyboardShortcutsDialog: (props) => {
    const tools = useTools()
    return (
      <DefaultKeyboardShortcutsDialog {...props}>
        <DefaultKeyboardShortcutsDialogContent />
        <TldrawUiMenuItem {...tools['katex']} />
      </DefaultKeyboardShortcutsDialog>
    )
  },
}

function App() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw
        shapeUtils={customShapeUtils}
        tools={customTools}
        overrides={uiOverrides}
        components={components}
      />
    </div>
  )
}

export default App
