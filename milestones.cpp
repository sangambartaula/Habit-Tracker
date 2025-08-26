// cpp file for class milestones

#include <iostream>
#include "milestones.h"

using namespace std;

// specified construct
Milestones::Milestones(int (&array)[8], int (&array2)[8], int (&array3)[8], int (&array4)[8], int (&array5)[8]){
	// defualt milestones, extend all if desired
	for(int i = 0; i < 8; i++){
		Miles_Ran[i] = array[i];
                Cleared[i]   = array2[i];
		Chores[i]    = array3[i];
		Hygiene[i]   = array4[i];
		Logins[i]    = array5[i];
	}
}

Milestones::~Milestones(){

}

// set functions
void Milestones::Set_miles(int miles, int index){
	Miles_Ran[index] = miles;
}

void Milestones::Set_logins(int logins, int index){
	Logins[index] = logins;
}

void Milestones::Set_cleared(int cleared, int index){
	Cleared[index] = cleared;
}

void Milestones::Set_chores(int chores, int index){
	Chores[index] = chores;
}

void Milestones::Set_hygiene(int hygiene, int index){
	Hygiene[index] = hygiene;
}

// get functions
int Milestones::Get_miles(int index){
	return Miles_Ran[index];
}

int Milestones::Get_logins(int index){
	return Logins[index];
}

int Milestones::Get_cleared(int index){
	return Cleared[index];
}

int Milestones::Get_chores(int index){
	return Chores[index];
}

int Milestones::Get_hygiene(int index){
	return Hygiene[index];
}

// print class, used to test first 8 elements in arrays
void Milestones::Print_class(){
	for(int i = 0; i < 8; i++){
		cout << "Miles["   << i << "]: " << Miles_Ran[i] << " ";
		cout << "Logins["  << i << "]: " << Logins[i] << " ";
                cout << "Cleared[" << i << "]: " << Cleared[i] << " ";
                cout << "Chores["  << i << "]: " << Chores[i] << " ";
                cout << "Hygiene[" << i << "]: " << Hygiene[i] << " ";
		cout << endl;
	}
}
