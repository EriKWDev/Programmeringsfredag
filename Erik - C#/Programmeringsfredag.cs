using System;
using System.Collections.Generic;

namespace Programmeringsfredag {
    class Armstod {
        static void Main(string[] args) {
			string input;
			Console.WriteLine("Enter armstod configuration:");
			input = Console.ReadLine ().ToUpper ();
			Console.Clear ();
			Console.WriteLine ("Configuration: " + input);
			Console.WriteLine ("Happiness: " + CalculateHappiness (input));
			Console.ReadLine ();
        }

		public static int CalculateHappiness (string input) {
			int happiness = 0;
			char[] inputCharArray = input.ToCharArray ();

			for (int i = 0; i < inputCharArray.Length; i++) {
				char current = inputCharArray[i];
				if (current != 'I') {
					char next = (i + 1 >= inputCharArray.Length ? inputCharArray[0] : inputCharArray[i + 1]);
					char prev = (i - 1 >= 0 ? inputCharArray[i - 1] : inputCharArray[inputCharArray.Length - 1]);
					bool nextIsOpen = (next == 'I' || next == 'H' || next == 'V' || next == 'h' || next == 'B');
					bool prevIsOpen = (prev == 'I' || prev == 'H' || prev == 'V' || prev == 'v' || prev == 'B');

					if (current == 'H') {
						if (nextIsOpen) {
							happiness++;
							inputCharArray[i] = 'h';
						}
					} else if (current == 'V') {
						if (prevIsOpen) {
							happiness++;
							inputCharArray[i] = 'v';
						}
					} else if (current == 'A') {
						if (prevIsOpen) {
							happiness++;
							inputCharArray[i] = 'v';
						} else if (nextIsOpen) {
							happiness++;
							inputCharArray[i] = 'h';
						}
					} else if (current == 'B') {
						if (prevIsOpen && nextIsOpen) {
							happiness++;
						} else {
							inputCharArray[i] = 'I';
						}
					}
				} else {
					happiness++;
				}
			}
			return happiness;
		}
	}
}