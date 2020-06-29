            // if B,C are empty & D is present
            if (!localeID && !subViolation && difficultyLevel) {
                //testing
                break;

            }
            // if B, D are empty &  C is present
            else if (!localeID && subViolation && !difficultyLevel) {
                //testing
                break;

            }
            // if B, C are present &  D is empty
            else if (localeID && subViolation && !difficultyLevel) {
                //testing
                break;

            }
            // if B, D are present &  C is empty
            else if (localeID && !subViolation && difficultyLevel) {
                //testing
                break;

            }
            // if B is present, &  C, D are empty
            else if (!localeID && subViolation && difficultyLevel) {
                //testing
                break;

            }


            // Push each example item to array on each iteration in loop