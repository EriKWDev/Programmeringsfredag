using System;
using System.Collections.Generic;

namespace ErikWDev {

	public class Programmeringsfredag {

		public enum Uppgifter { 
			ARMSTOD,
			DUTUB
		}

		public static Uppgifter uppgift = Uppgifter.ARMSTOD;

		static void Main (string[] args) {
			switch (uppgift) {
				default:
				case Uppgifter.ARMSTOD:
					Armstod.Happiness (args);
					break;
				case Uppgifter.DUTUB:
					DuTub.Efficiency (args);
					break;
			}
		}
	}

	class Armstod {
		public static void Happiness (string[] arg) {
			string input;
			Console.WriteLine ("Enter armstod configuration:");
			input = Console.ReadLine ().ToUpper ();
			Console.Clear ();
			Console.WriteLine ("Configuration: " + input);
			Console.WriteLine ("Happiness: " + Armstod.CalculateHappiness (input));
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
					bool nextIsOpen = next != 'v' && next != 'A';
					bool prevIsOpen = prev != 'h' && prev != 'A';

					if (current == 'H' && nextIsOpen) {
						happiness++;
						inputCharArray[i] = 'h';
					} else if (current == 'V' && prevIsOpen) {
						happiness++;
						inputCharArray[i] = 'v';
					} else if (current == 'A' && prevIsOpen) {
						happiness++;
						inputCharArray[i] = 'v';
					} else if (current == 'A' && nextIsOpen) {
						happiness++;
						inputCharArray[i] = 'h';
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

	class DuTub {
		public static void Efficiency (string[] args) {
			Console.WriteLine ("Number of videos: ");
			int n = Int32.Parse(Console.ReadLine ());
			Console.Clear ();


			for (int i = 1; i <= n; i++) {
				Console.Write ("Video " + i + " length: ");
			}
			Console.ReadLine ();
		}
	}
}