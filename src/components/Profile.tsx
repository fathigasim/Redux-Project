// import React from 'react';
import { useSelector } from 'react-redux';
import './profile.css';
import { AppDispatch, RootState } from '../app/store';
import { useDispatch } from 'react-redux';
import { fetchProfile } from '../features/profileSlice';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ListGroup,ListGroupItem } from 'react-bootstrap';
const Profile = () => {
      const{t}=useTranslation("profile");
     const { userId, email, userName, roles, loading } = useSelector((state: RootState) => state.profile);
     const dispatch = useDispatch<AppDispatch>();
  //if (!user) return null;
  useEffect(() => {
    const getProfile = async () => {
        try {
    await dispatch(fetchProfile()).unwrap();
       console.log(`Fetched profile for user: ${userName}`);
        }
        catch (error) {
            console.error("Failed to fetch profile:", error);
        }
    };
    getProfile();
  },[dispatch]);
  return (
    <>
    {loading ? (
      <div>{t("Loadingprofile")}...</div>
    ) : (
   <div className="container rounded bg-white mt-5 mb-5">
    <div className ="row">
        <div className ="col-md-3 border-right">
            <div className  ="d-flex flex-column align-items-center text-center p-3 py-5"><img className  ="rounded-circle mt-5" width="150px" src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"/><span className  ="font-weight-bold">Edogaru</span><span className ="text-black-50">edogaru@mail.com.my</span><span> </span></div>
        </div>
        <div className  ="col-md-5 border-right">
            <div className  ="p-3 py-5">
                <div className  ="d-flex justify-content-between align-items-center mb-3">
                    <h4 className ="text-right">{t("ProfileSettings")}</h4>
                </div>
                <div className  ="row mt-2">
                    <div className  ="col-md-6 col-sm-12"><label className  ="labels">Name</label><input type="text" className  ="form-control" placeholder="first name" value={userName}/></div>
                    <div className  ="col-md-6 col-sm-12"><label className  ="labels">Level</label>
                   <ListGroup>
                    <ListGroupItem>{roles.join(", ")}</ListGroupItem>
                    </ListGroup> 
                    
                    </div>
                </div>
                <div className  ="row mt-3">
                    <div className  ="col-md-12"><label className ="labels">Mobile Number</label><input type="text" className  ="form-control" placeholder="enter phone number" value=""/></div>
                    <div className  ="col-md-12"><label className ="labels">Address Line 1</label><input type="text" className ="form-control" placeholder="enter address line 1" value=""/></div>
                    
                    <div className  ="col-md-12"><label className ="labels">Postcode</label><input type="text" className ="form-control" placeholder="enter address line 2" value=""/></div>
                    <div className  ="col-md-12"><label className ="labels">State</label><input type="text" className  ="form-control" placeholder="enter address line 2" value=""/></div>
                    <div className  ="col-md-12"><label className ="labels">Area</label><input type="text" className ="form-control" placeholder="enter address line 2" value=""/></div>
                    <div className  ="col-md-12"><label className ="labels">Email ID</label><input type="text" className ="form-control" placeholder="enter email id" value={email}/></div>
                    <div className  ="col-md-12"><label className ="labels">Education</label><input type="text" className  ="form-control" placeholder="education" value=""/></div>
                </div>
                <div className  ="row mt-3">
                    <div className  ="col-md-6 col-sm-12"><label className  ="labels">Country</label><input type="text" className ="form-control" placeholder="country" value=""/></div>
                    <div className  ="col-md-6 col-sm-12"><label className  ="labels">State/Region</label><input type="text" className  ="form-control" value="" placeholder="state"/></div>
                </div>
                <div className  ="mt-5 text-center"><button disabled className ="btn btn-primary profile-button" type="button">Save Profile</button></div>
            </div>
        </div>
        {/* <div className  ="col-md-4">
            <div className  ="p-3 py-5">
                <div className  ="d-flex justify-content-between align-items-center experience"><span>Edit Experience</span><span className ="border px-3 p-1 add-experience"><i className ="fa fa-plus"></i>&nbsp;Experience</span></div><br/>
                <div className  ="col-md-12"><label className ="labels">Experience in Designing</label><input type="text" className  ="form-control" placeholder="experience" value=""/></div> <br/>
                <div className  ="col-md-12"><label className ="labels">Additional Details</label><input type="text" className="form-control" placeholder="additional details" value="" /></div>
            </div>
        </div> */}
    </div>
</div>

    )}

    </>
  );
};

export default Profile;
