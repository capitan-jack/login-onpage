var $ = require('jquery');
var React = require('react');

var LoginSignupModal = React.createClass({
    openUpModal: function(){
        if(screen.width > 500){
            this.refs.loginSignupModal.style.display = 'block';
            this.refs.overlay.style.display = 'block';
            this.refs.loginSignupModal.style.width = '50%';
            this.refs.loginSignupModal.style.left = '25%';
        }
        else{
            this.refs.loginSignupModal.style.display = 'block';
            this.refs.overlay.style.display = 'block';
        }        
    },
    componentDidMount:function(){
        jQuery.getScript('//connect.facebook.net/en_US/sdk.js', function(){
          FB.init({
            appId: this.props.fbAppId,
            version: this.props.fbAppVersion,
            status : true, // check login status
            cookie : true, // enable cookies to allow the server to access the session
            xfbml  : true  // parse XFBML
          });
        }.bind(this));
    },
    loginGoogle:function(event){
        event.preventDefault();
        var next = window.location.pathname;
        window.location.href = "/accounts/google_login?next=" + next;
    },
    fbApiLogin:function(){
        FB.api('/me?fields=name,email', function(response) {
          var username=response.email;
          var name=response.name;
          var facebook_id=response.id;
          this.fbLoginFsAccounts(username,name,facebook_id);
        }.bind(this));
    },
    fbLoginFsAccounts:function(username,name,facebook_id){
        var data={ name:name,email:username,facebook_id:facebook_id};
        var URL='/accounts/facebook_login';
        $.ajax({
            type: "POST",
            url: URL,
            data: data,
            success: function(response){
                this.loginFsDiskus(response.new_user, name);
            }.bind(this),
            errors: function(response){
                Materialize.toast('<div class="fs-toast-text edgy">Error in facebook login, Try again.</div>', 2000, 'fs-toast-edgy', function(){window.location.reload();});
            },
            dataType: 'json',
        });
    },
    loginFsDiskus:function(new_user, name){
        $.ajax({
            type: "GET",
            url: '/app_login',
            success: function(response){
                if(new_user){
                    Materialize.toast('<div class="fs-toast-text edgy">Hi, ' + name.split(" ")[0] + ' Update Profile from' + 
                                      '<i class="material-icons" style="vertical-align:bottom;">person_outline</i>' + 
                                      ' menu</div>', 2500, 'fs-toast-edgy', function(){window.location.reload();});               
                }else{
                    Materialize.toast('<div class="fs-toast-text edgy">Welcome Back!</div>', 1000,
                                      'fs-toast-edgy',function(){window.location.reload();});
                }
            }.bind(this),
            errors: function(response){
                Materialize.toast('<div class="fs-toast-text edgy">Error in app login, Try again.</div>', 2000, 'fs-toast-edgy', function(){window.location.reload();});
            },
            dataType: 'json',
        });
    },
    loginFacebook:function(){
        $(this.refs.loginSignupModal).closeModal();
        FB.login(function(response) {
           if (response.status === 'connected') {
               this.fbApiLogin();
            } 
            else {
                Materialize.toast("Unable to login, Please Try other methods.", 8000, 'rounded');
            }
        }.bind(this),{scope: 'public_profile,email'});
    },
    signUp:function(event){
        event.preventDefault();
        var next = window.location.pathname;
        $(this.refs.loginSignupModal).closeModal();
        window.location.href = "/accounts/landing?next=" + next;
    },
    componentWillUnmount:function(){
        this.refs.loginSignupModal.style.display = 'none';
        this.refs.overlay.style.display = 'none';
    },
    closeModal:function(){
        this.refs.loginSignupModal.style.display = 'none';
        this.refs.overlay.style.display = 'none';
    },
    render:function(){
        return(
            <div ref="wrapper">
                <div ref="overlay" key="overlay" onClick={this.closeModal}
                         style={{zIndex:'1002', display:'none', opacity:'0.5', position:'fixed', top:'-100px', left:'0px',
                                 bottom:'0px', right:'0px', height:'125%', width:'100%', backgroundColor:'black'}}></div>
                <div ref="loginSignupModal" key="modal" style={{display:'none', position:'fixed', bottom:'0px',
                                                                width:'100%', backgroundColor:'white', zIndex:'1005'}}>
                    <div key="modal" style={{padding:"5px", backgroundColor:'white', zIndex:'1005'}}>
                        <div style={{"textAlign":"center","fontSize":"0.9rem"}}> 
                            <b>Login or Signup to continue</b> 
                        </div>
                        <hr style={{"margin":"0px 10px",marginBottom:"7px"}}/>
                        <div style={{marginBottom:'20px'}}>
                            <a onClick={this.loginGoogle} style={{border:"2px solid #E74C3C",fontSize:"0.8rem",
                                                                  textAlign:"center",width:"40%",padding:"8px 0px",
                                                                  display:"inline-block",marginLeft:"7%",borderRadius:"7px",
                                                                  color:'black'}}>
                                Login with Google
                            </a>
                            <a onClick={this.loginFacebook} style={{border:"2px solid #3498DB",fontSize:"0.8rem",
                                                                    textAlign:"center",width:"40%",padding:"8px 0px",
                                                                    display:"inline-block",marginLeft:"7%",borderRadius:"7px",
                                                                    color:'black'}}> 
                                Login with Facebook
                            </a>
                        </div>
                        <div style={{marginBottom:'10px', textAlign:'center'}}>
                           <a href="/accounts/landing" onClick={this.signUp} 
                              style={{border:"2px solid #ff5722",fontSize:"0.8rem",textAlign:"center",
                                      padding:"8px 0px",borderRadius:"7px",color:"black", width:"40%", display:'inline-block'}}>
                                Sign up
                            </a>
                        </div> 
                    </div>
                </div>
            </div>
            );
    }
});

module.exports = LoginSignupModal;
