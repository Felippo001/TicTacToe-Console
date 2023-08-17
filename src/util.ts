

export function deepCopy<T>(object:T){
    return JSON.parse(JSON.stringify(object)) as T
}

export function formatMatrix<T>(originalMatrix: T[][], verticalSeparator = '|', horizontalSeparator = '-', horizontalSeparatorPerCol = 5) : string[][]{
    const matrix = deepCopy(originalMatrix)
    const preFormattedMatrix : string[][] = [] 
    
    for(let i=0; i<matrix.length; i++)
        for(let j=0; j<matrix[i].length; j++){
            if(!preFormattedMatrix[i])
                preFormattedMatrix[i] = []

            if(j == 0)
                preFormattedMatrix[i].push('')
            
            if(j == matrix[i].length-1)
                preFormattedMatrix[i].push(matrix[i][j] + '')
            else
                preFormattedMatrix[i].push(matrix[i][j] + '', verticalSeparator)
        }
    
    const formattedMatrix : string[][] = []
    for(let i=0; i<preFormattedMatrix.length; i++){
        const numCols = preFormattedMatrix[i].length

        if(i == preFormattedMatrix.length-1)
            formattedMatrix.push(preFormattedMatrix[i])
        else
            formattedMatrix.push(
                preFormattedMatrix[i],
                [horizontalSeparator.repeat(numCols * horizontalSeparatorPerCol)]
            )
    }
    
    return formattedMatrix
}
