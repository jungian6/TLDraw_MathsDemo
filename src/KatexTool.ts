import { 
	createShapeId,
	StateNode 
} from 'tldraw'

// Define the katex tool to be used in the tldraw editor
export class KatexTool extends StateNode {
	static override id = 'katex'

	// When the tool is selected, set the cursor to a crosshair
	override onEnter = () => {
		this.editor.setCursor({ type: 'cross', rotation: 0 })
	}

	// When the user clicks, create a new katex shape at the clicked point
	override onPointerDown = () => {
		const { currentPagePoint } = this.editor.inputs;
		const id = createShapeId();

		// Create the math shape at the clicked point
		this.editor.createShape({ 
			id: id,
			type: 'katex-shape', 
			x: currentPagePoint.x, 
			y: currentPagePoint.y })

		// Set the shape to be edited
		this.editor.setEditingShape(id);

		// Set the current tool to select
		this.editor.setCurrentTool('select');
	}
} 