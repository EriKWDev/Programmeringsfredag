package programmeringsolympiaden.twenty17;
import java.util.ArrayList;
import java.util.List;

import javax.swing.JOptionPane;

public class Uppgift3 {

	public static void main(String[] args) {
		label0:
		{
			List<int[]> chairs = new ArrayList<int[]>();
			int happiness = 0;
			
			label1:
			while(true) {
				int n = 0;
				try {
					String s = JOptionPane.showInputDialog("Antal Personer?");
					if(s == null) {
						break label0;
					}
					n = Integer.parseInt(s);
				} catch(NumberFormatException e) {
					JOptionPane.showMessageDialog(null, "Måste vara ett positivt heltal!");
					continue;
				}
				String preferenser = JOptionPane.showInputDialog("Preferenser?");
				
				if(preferenser == null) {
					break label0;
				}
				
				char[] charArray = preferenser.toCharArray();
				if(n == charArray.length) {
					for(int i = 0; i < n; i++) {
						char chair = Character.toUpperCase(charArray[i]);
						try {
							chairs.add(getArrayFromChar(chair));
						} catch(UnsupportedOperationException e) {
							JOptionPane.showMessageDialog(null, "Får endast innehålla V, H, A, B eller I!");
							continue label1;
						}
					}
					break;
				}
				else {
					JOptionPane.showMessageDialog(null, "Alla personer måste ha en preferens!");
				}
			}
			
			for(int i = 0; i < chairs.size(); i++) {
				int[] leftChair;
				int[] chair = chairs.get(i);
				try {
					leftChair = chairs.get(i - 1);
				} catch(Exception e) {
					leftChair = chairs.get(chairs.size() - 1);
				}
				if(chair[0] >= 0 || chair[1] >= 0) {
					if(chair[0] == 0) {
						if(chair[1] < 0) {
							chair[1] = 1;
						}
						happiness++;
					}
					else {
						if(leftChair[1] < 1) {
							chair[0] = 1;
							happiness++;
						}
						else {
							chair[0] = 0;
						}
					}
				}
			}
			
			for(int i = 0; i < chairs.size(); i++) {
				int[] leftChair;
				int[] chair = chairs.get(i);
				int[] rightChair;
				try {
					leftChair = chairs.get(i - 1);
				} catch(Exception e) {
					leftChair = chairs.get(chairs.size() - 1);
				}
				try {
					rightChair = chairs.get(i + 1);
				} catch(Exception e) {
					rightChair = chairs.get(0);
				}
				if(chair[0] == -1 && chair[1] == -1) {
					if(leftChair[1] <= 0 && rightChair[0] <= 0) {
						chair[0] = 1;
						chair[1] = 1;
						happiness++;
					}
					else {
						chair[0] = 0;
						chair[1] = 0;
					}
				}
				else if(chair[0] == -2 && chair[1] == -2) {
					if(leftChair[1] <= 0) {
						chair[0] = 1;
						chair[1] = 0;
						happiness++;
					}
					else if(rightChair[0] <= 0) {
						chair[0] = 0;
						chair[1] = 1;
						happiness++;
					}
				}
			}
			JOptionPane.showMessageDialog(null, "Antal nöjda: " + happiness);
		}
	}
	
	public static int[] getArrayFromChar(char stol) throws UnsupportedOperationException {
		switch(stol) {
		case 'V':
			return new int[] {-1, 0};
		case 'H':
			return new int[] {0, -1};
		case 'A':
			return new int[] {-2, -2};
		case 'B':
			return new int[] {-1, -1};
		case 'I':
			return new int[] {0, 0};
		default:
			throw new UnsupportedOperationException();
		}
	}
	
}