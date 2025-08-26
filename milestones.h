// Header file to keep track and store milestone records;

#ifndef MILESTONES_H
#define MILESTONES_H

class Milestones{
	public:
		Milestones() = default;
		Milestones(int (&array)[8], int (&array2)[8], int (&array3)[8], int (&array4)[8], int (&array5)[8]);
		~Milestones();
// set functions
		void Set_miles(int miles, int index);
		void Set_logins(int logins, int index);
		void Set_cleared(int cleared, int index);
		void Set_chores(int chores, int index);
		void Set_hygiene(int hygiene, int index);
// get functions
		int Get_miles(int index);
		int Get_logins(int index);
		int Get_cleared(int index);
		int Get_chores(int index);
		int Get_hygiene(int index);
// misc.
		void Print_class();

	private:
// default values for milestones
		int Miles_Ran[8] = {1, 3, 5, 10, 30, 50, 75, 100};
		int Logins[8] = {1, 7, 14, 30, 60, 91, 213, 365};
		int Cleared[8] = {1, 3, 5, 10, 30, 50, 75, 100};
		int Chores[8] = {1, 3, 5, 10, 30, 50, 75, 100};
		int Hygiene[8] = {1, 3, 5, 10, 30, 50, 75, 100};
};

#endif


