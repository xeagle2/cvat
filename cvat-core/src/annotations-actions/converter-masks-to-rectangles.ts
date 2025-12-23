// Copyright (C) CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import { BaseShapesAction, ShapesActionInput, ShapesActionOutput } from './base-shapes-action';
import { ActionParameters } from './base-action';
import { ObjectType, ShapeType } from '../enums';
import ObjectState from '../object-state';

export class ConverterMasksToRectangles extends BaseShapesAction {
    public async init(): Promise<void> {
        // nothing to init
    }

    public async destroy(): Promise<void> {
        // nothing to destroy
    }

    public async run(input: ShapesActionInput): Promise<ShapesActionOutput> {
        console.log('run', input);

        const maskShapes = input.collection.shapes
            .filter((shape) => shape.type === ShapeType.MASK);

        input.collection.shapes
            .filter((shape) => shape.type === ShapeType.MASK)
            .forEach((shape) => {
                let points = shape.points.slice(-4);
                points = [
                    points[0], points[1],
                    points[2], points[3],
                ];

                console.log('old points', shape.points);
                shape.points = points;
                shape.type = ShapeType.RECTANGLE;

                console.log('new points', shape.points);
            });

        return {
            created: input.collection,
            deleted: { shapes: maskShapes },
        };
    }

    public applyFilter(input: ShapesActionInput): ShapesActionInput['collection'] {
        console.log('applyFilter', input);
        const { collection } = input;
        return collection;
    }

    public isApplicableForObject(objectState: ObjectState): boolean {
        return objectState.objectType === ObjectType.SHAPE && objectState.shapeType === ShapeType.MASK;
    }

    public get name(): string {
        return 'Shapes converter: masks to rectangles';
    }

    public get parameters(): ActionParameters | null {
        return null;
    }
}
